<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    version="1.0">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <header class="ck-navbar">
            <div class="ck-navbar__info">

                <xsl:if test="normalize-space($course-code) != ''">
                    <div class="ck-navbar__course">
                        <xsl:value-of select="$course-code"/>
                    </div>
                </xsl:if>

                <xsl:if test="normalize-space($course-title) != ''">
                    <div class="ck-navbar__page">
                        <xsl:value-of select="$course-title"/>
                    </div>
                </xsl:if>

                <xsl:if test="count(/*/*[local-name()='link']) > 0">
                    <nav class="ck-navbar__nav">
                        <span class="ck-navbar__trigger">
                            <xsl:choose>
                                <xsl:when test="/*/@navigate-label">
                                    <xsl:value-of select="/*/@navigate-label"/> ▾
                                </xsl:when>
                                <xsl:otherwise>Navigate ▾</xsl:otherwise>
                            </xsl:choose>
                        </span>
                        <div class="ck-navbar__dropdown">
                            <ck-slot name="link"/>
                        </div>
                    </nav>
                </xsl:if>

            </div>

            <div class="ck-navbar__trailing">
                <xsl:if test="count(/*/*[local-name()='theme-switch']) > 0">
                    <div class="ck-navbar__theme">
                        <ck-slot name="theme-switch"/>
                    </div>
                </xsl:if>

                <xsl:if test="normalize-space($module-name) != ''">
                    <div class="ck-navbar__module">
                        <xsl:value-of select="$module-name"/>
                    </div>
                </xsl:if>
            </div>
        </header>
    </xsl:template>

</xsl:stylesheet>
