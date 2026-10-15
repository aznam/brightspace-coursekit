<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <header class="ck-navbar">
            <div class="ck-navbar__info">
                
                <div class="ck-navbar__course"/>
                <div class="ck-navbar__page"/>
                
                <xsl:if test="count(/*/*[local-name()='link']) > 0">
                    <nav class="ck-navbar__nav">
                        <span class="ck-navbar__trigger">
                            <xsl:choose>
                                <xsl:when test="/*/@navigate-label"><xsl:value-of select="/*/@navigate-label"/> ▾</xsl:when>
                                <xsl:otherwise>Navigate ▾</xsl:otherwise>
                            </xsl:choose>
                        </span>
                        <div class="ck-navbar__dropdown">
                            <ck-children/>
                        </div>
                    </nav>
                </xsl:if>
                
            </div>
            <div class="ck-navbar__module"/>
        </header>
    </xsl:template>
    
</xsl:stylesheet>