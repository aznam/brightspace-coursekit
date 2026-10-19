<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:xsp="urn:coursekit:preprocessor"
                xmlns="http://www.w3.org/1999/xhtml"
                version="1.0">
    <xsl:import href="$(frameworkRoot)/visual/hero/template.xslt"/>

    <xsp:extend match="/" slot="before-title">
        <xsl:if test="string(/*/@label)">
            <div class="assignment-hero-eyebrow">
                <xsl:value-of select="/*/@label"/>
            </div>
        </xsl:if>
    </xsp:extend>
</xsl:stylesheet>
